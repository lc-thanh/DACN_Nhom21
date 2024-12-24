-- 1. Tạo Stored Procedure nếu chưa có
IF OBJECT_ID('dbo.UpdateLoanStatusToOverdue', 'P') IS NOT NULL
    DROP PROCEDURE dbo.UpdateLoanStatusToOverdue;
GO

CREATE PROCEDURE dbo.UpdateLoanStatusToOverdue
AS
BEGIN
    SET NOCOUNT ON;

    -- Cập nhật trạng thái của các phiếu mượn quá hạn
    UPDATE Loans
    SET Status = 3
    WHERE Status = 1 AND DueDate < GETDATE();
END;
GO

-- 2. Tạo Job nếu chưa có
DECLARE @job_id UNIQUEIDENTIFIER;

-- Xóa job cũ nếu đã tồn tại
IF EXISTS (SELECT 1 FROM msdb.dbo.sysjobs WHERE name = N'UpdateLoanStatusJob')
BEGIN
    EXEC msdb.dbo.sp_delete_job @job_name = N'UpdateLoanStatusJob';
END;

-- Tạo Job mới
EXEC msdb.dbo.sp_add_job 
    @job_name = N'UpdateLoanStatusJob', 
    @enabled = 1, 
    @description = N'Job to update loan status to Overdue daily',
    @notify_level_eventlog = 2, 
    @delete_level = 0,
    @job_id = @job_id OUTPUT;

-- 3. Thêm Step vào Job để gọi Procedure
EXEC msdb.dbo.sp_add_jobstep 
    @job_id = @job_id, 
    @step_name = N'Execute UpdateLoanStatusToOverdue', 
    @subsystem = N'TSQL', 
    @command = N'EXEC dbo.UpdateLoanStatusToOverdue;', 
    @on_success_action = 1, 
    @on_fail_action = 2, 
    @retry_attempts = 0, 
    @retry_interval = 0;

-- 4. Gán lịch chạy cho Job (hằng ngày vào giờ chỉ định)
EXEC msdb.dbo.sp_add_jobschedule 
    @job_id = @job_id, 
    @name = N'DailySchedule', 
    @enabled = 1, 
    @freq_type = 4,  -- Hằng ngày
    @freq_interval = 1, 
    @active_start_time = 114000; -- 000000 => 00:00:00

-- 5. Gán Job cho Server
EXEC msdb.dbo.sp_add_jobserver 
    @job_id = @job_id, 
    @server_name = @@SERVERNAME;

-- 6. Chạy Job ngay lập tức (tùy chọn)
EXEC msdb.dbo.sp_start_job @job_name = N'UpdateLoanStatusJob';
GO
