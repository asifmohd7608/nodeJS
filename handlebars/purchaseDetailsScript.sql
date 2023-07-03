USE books;
SELECT p.id,p.Customer_Id,c.First_Name,B.id,B.Book_Title AS Book_Name,B.Price AS unit_price,Purchase_Count,p.Amount
FROM purchases p
JOIN customers c ON p.Customer_Id=c.id
JOIN books b ON b.id=p.Book_Id