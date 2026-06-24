function processData(data) {
    const invalid_entries = [];
    const duplicate_edges = [];
    const validEdges = [];
    const seen = new Set();
    const graph = {};
    const childSet = new Set();
    const allNodes = new Set();

    if (!Array.isArray(data)) {
        return {
            hierarchies: [],
            invalid_entries: [],
            duplicate_edges: [],
            summary: {
                total_trees: 0,
                total_cycles: 0,
                largest_tree_root: ""
            }
        };
    }

    // Validation
    for (let entry of data) {
        entry = String(entry).trim();

        if (!/^[A-Z]->[A-Z]$/.test(entry)) {
            invalid_entries.push(entry);
            continue;
        }

        const [parent, child] = entry.split("->");

        if (parent === child) {
            invalid_entries.push(entry);
            continue;
        }

        if (seen.has(entry)) {
            if (!duplicate_edges.includes(entry)) {
                duplicate_edges.push(entry);
            }
            continue;
        }

        seen.add(entry);
        validEdges.push([parent, child]);

        if (!graph[parent]) graph[parent] = [];
        graph[parent].push(child);

        childSet.add(child);
        allNodes.add(parent);
        allNodes.add(child);
    }

    // Roots
    const roots = Object.keys(graph).filter(node => !childSet.has(node));

    const hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = "";
    let maxDepth = 0;

    function buildTree(node, visited, path) {
        if (path.has(node)) {
            return { cycle: true };
        }

        path.add(node);
        visited.add(node);

        const subtree = {};
        let depth = 1;

        if (graph[node]) {
            for (const child of graph[node]) {
                const result = buildTree(child, visited, new Set(path));

                if (result.cycle) {
                    return { cycle: true };
                }

                subtree[child] = result.tree;
                depth = Math.max(depth, result.depth + 1);
            }
        }

        return { tree: subtree, depth };
    }

    function markComponent(node, visited) {
        if (visited.has(node)) return;

        visited.add(node);

        if (graph[node]) {
            for (const child of graph[node]) {
                markComponent(child, visited);
            }
        }
    }

    const visited = new Set();

    for (const root of roots) {
        const result = buildTree(root, visited, new Set());

        if (result.cycle) {
            markComponent(root, visited);
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
            total_cycles++;
        } else {
            hierarchies.push({
                root,
                tree: {
                    [root]: result.tree
                },
                depth: result.depth
            });

            total_trees++;

            if (
                result.depth > maxDepth ||
                (result.depth === maxDepth && root < largest_tree_root)
            ) {
                maxDepth = result.depth;
                largest_tree_root = root;
            }
        }
    }

    for (const node of allNodes) {
        if (visited.has(node)) continue;

        const result = buildTree(node, visited, new Set());

        if (result.cycle) {
            markComponent(node, visited);
            hierarchies.push({
                root: node,
                tree: {},
                has_cycle: true
            });
            total_cycles++;
        }
    }

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
}

module.exports = processData;
