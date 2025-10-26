// Link Actors to Roles
MATCH (a:Actor {name:'Фермер Іван'}), (r:Role {name:'Виробник'}) 
CREATE (a)-[:PARTICIPATES_AS]->(r);

MATCH (a:Actor {name:'OSBB Київ Центр'}), (r:Role {name:'Споживач / самозабезпечувач'}) 
CREATE (a)-[:PARTICIPATES_AS]->(r);

MATCH (a:Actor {name:'ЕнергоКооператив Полтава'}), (r:Role {name:'Інтегратор / збирач систем'}) 
CREATE (a)-[:PARTICIPATES_AS]->(r);

MATCH (a:Actor {name:'Деревообробка Черкаси'}), (r:Role {name:'Постачальник ресурсів / палива'}) 
CREATE (a)-[:PARTICIPATES_AS]->(r);

MATCH (a:Actor {name:'Банк Відбудови'}), (r:Role {name:'Фінансист / регулятор / адміністратор'}) 
CREATE (a)-[:PARTICIPATES_AS]->(r);

MATCH (a:Actor {name:'Міненерго'}), (r:Role {name:'Фінансист / регулятор / адміністратор'}) 
CREATE (a)-[:PARTICIPATES_AS]->(r);
