using LibraryManagerApp.Data.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace LibraryManagerApp.Data.Services
{
    public class LoanStatusUpdaterService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<LoanStatusUpdaterService> _logger;

        public LoanStatusUpdaterService(IServiceProvider serviceProvider, ILogger<LoanStatusUpdaterService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Loan Status Updater Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<LibraryManagerAppDbContext>();
                        await UpdateLoanStatusesAsync(dbContext, stoppingToken);
                    }

                    // Tính thời gian đến GIỜ CHẠY hôm nay hoặc ngày mai
                    var now = DateTime.Now;
                    var todayRun = now.Date.AddHours(0).AddMinutes(0); // Tùy chỉnh GIỜ CHẠY
                    var nextRun = todayRun > now ? todayRun : todayRun.AddDays(1); // Nếu đã qua GIỜ CHẠY thì đợi GIỜ CHẠY chạy ngày mai
                    var delay = nextRun - now;

                    // Chờ đến thời điểm GIỜ CHẠY
                    await Task.Delay(delay, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while updating loan statuses.");
                }
            }

            _logger.LogInformation("Loan Status Updater Service is stopping.");
        }

        private async Task UpdateLoanStatusesAsync(LibraryManagerAppDbContext dbContext, CancellationToken cancellationToken)
        {
            var overdueLoans = await dbContext.Loans
                .Where(loan => loan.DueDate < DateTime.Now && loan.Status == Enum.StatusEnum.OnLoan)
                .Include(loan => loan.Member)
                .ToListAsync(cancellationToken);

            foreach (var loan in overdueLoans)
            {
                loan.Status = Enum.StatusEnum.Overdue;
                loan.Member.Status = Enum.MemberStatus.Overdue;
            }

            await dbContext.SaveChangesAsync(cancellationToken);

            if (overdueLoans.Any())
            {
                _logger.LogInformation($"Updated {overdueLoans.Count} loans to Overdue status.");
            }
        }
    }

}
