// select teams.name, teams.id from users inner join teams where users.email = 'daffy_duck@qa.com' and teams.id = users.team_id;
/* name|id
qa-efla9j2t9jiyjkghnp|8476817264
qa-707b996f6c27793e23|8476809328
*/

// select id from teams where email_domain like 'qa.com' and id not in (select team_id from users where email = 'daffy_duck@qa.com');