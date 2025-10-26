# Neo4j Community Edition supports only one database called "neo4j"
DATABASE := "neo4j"
PASSWORD := "qwerty123"
USERNAME := "neo4j"

init:
    # --- Create Role nodes ---
    cypher-shell -u {{USERNAME}} -p {{PASSWORD}} -f init/roles.cypher

    # --- Create Actor nodes ---
    cypher-shell -u {{USERNAME}} -p {{PASSWORD}} -f init/actors.cypher

    # --- Link Actors to Roles ---
    cypher-shell -u {{USERNAME}} -p {{PASSWORD}} -f init/relationships.cypher
