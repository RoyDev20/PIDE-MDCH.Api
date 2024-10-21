export default {



    getAllAgents : `
    
    SELECT tt.*, (Closed + Opened + Solved) as Tickets FROM(
        SELECT
          user_name, user_id,
          COUNT(CASE WHEN status_desc = "Closed" THEN status END) "Closed",
          COUNT(CASE WHEN status_desc = "Opened" THEN status END) "Opened",
          COUNT(CASE WHEN status_desc = "Solved" THEN status END) "Solved",
          ((COUNT(CASE WHEN status_desc = "Closed" THEN status END) * 100)/(COUNT(CASE WHEN status_desc = "Closed" THEN status END) + COUNT(CASE WHEN status_desc = "Opened" THEN status END) + COUNT(CASE WHEN status_desc = "Solved" THEN status END)) ) AS porcentaje_Cerrado
        FROM (
        SELECT glpi_users.name AS user_name, glpi_users.id AS user_id , glpi_tickets.status,
                CASE WHEN glpi_tickets.status = 5 THEN 'Solved'
                WHEN glpi_tickets.status = 6 THEN 'Closed'
                ELSE 'Opened' END status_desc
                FROM glpi_tickets
                INNER JOIN glpi_tickets_users ON glpi_tickets_users.tickets_id = glpi_tickets.id
                INNER JOIN glpi_users ON glpi_users.id = glpi_tickets_users.users_id
                WHERE glpi_tickets.is_deleted = 0 
            
                AND glpi_tickets.date BETWEEN '2022-01-01 00:00:00' AND '2022-10-25 23:59:59'
                AND glpi_tickets.entities_id IN (0,1,2) LIMIT 0, 50000000 
                
                ) t
        GROUP BY user_name) tt
        ORDER BY Tickets DESC;
    
    `,
    GetByCategories : `
    
    SELECT tt.*, CAST(  (Closed + Opened + Solved) AS int) as Tickets  FROM(
        SELECT
          name,
          CAST( COUNT(CASE WHEN status_desc = "Closed" THEN status END) AS int) "Closed",
          CAST( COUNT(CASE WHEN status_desc = "Opened" THEN status END) AS int) "Opened",
          CAST( COUNT(CASE WHEN status_desc = "Solved" THEN status END) AS int) "Solved"
        FROM (
        SELECT glpi_itilcategories.id, glpi_itilcategories.completename AS name, glpi_tickets.status,
            CASE WHEN glpi_tickets.status = 5 THEN 'Solved'
                WHEN glpi_tickets.status = 6 THEN 'Closed'
                ELSE 'Opened' END status_desc
            FROM glpi_itilcategories, glpi_tickets
            WHERE glpi_tickets.is_deleted = 0
            AND glpi_tickets.itilcategories_id = glpi_itilcategories.id
            ? 
            AND glpi_tickets.entities_id IN (0,1,2)  
                ) t
        GROUP BY name) tt
        ORDER BY Tickets DESC LIMIT ?, ?; 
    `,


    GetListByRequestType : `
    
    SELECT tt.*, (Closed + Opened + Solved) as Tickets FROM(
        SELECT
          fuente_solicitud, fuente_solicitud_id,
          COUNT(CASE WHEN status_desc = "Closed" THEN status END) "Closed",
          COUNT(CASE WHEN status_desc = "Opened" THEN status END) "Opened",
          COUNT(CASE WHEN status_desc = "Solved" THEN status END) "Solved",
          ((COUNT(CASE WHEN status_desc = "Closed" THEN status END) * 100)/(COUNT(CASE WHEN status_desc = "Closed" THEN status END) + COUNT(CASE WHEN status_desc = "Opened" THEN status END) + COUNT(CASE WHEN status_desc = "Solved" THEN status END)) ) AS porcentaje_Cerrado
        FROM (
        SELECT glpi_requesttypes.id AS fuente_solicitud_id,  glpi_requesttypes.name AS fuente_solicitud, glpi_tickets.status,
            CASE WHEN glpi_tickets.status = 5 THEN 'Solved'
                WHEN glpi_tickets.status = 6 THEN 'Closed'
                ELSE 'Opened' END status_desc
            FROM glpi_tickets
            INNER JOIN glpi_requesttypes ON glpi_requesttypes.id = glpi_tickets.requesttypes_id
            WHERE glpi_tickets.is_deleted = 0           
            AND DATE(glpi_tickets.date) BETWEEN ? AND ?
            AND glpi_tickets.entities_id IN (0,1,2)  
                ) t
        GROUP BY fuente_solicitud_id) tt
        ORDER BY Tickets DESC LIMIT ?, ?;
    `
}