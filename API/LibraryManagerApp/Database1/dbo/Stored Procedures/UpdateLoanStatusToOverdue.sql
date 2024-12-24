CREATE PROCEDURE UpdateLoanStatusToOverdue
AS
BEGIN
    SET NOCOUNT ON;

    -- Cập nhật trạng thái của các phiếu mượn quá hạn
    UPDATE Loans
    SET Status = 3
    WHERE Status = 1 AND DueDate < GETDATE();
END