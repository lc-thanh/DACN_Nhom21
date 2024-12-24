namespace LibraryManagerApp.Data.Dto
{
    public class LoanStatisticModel
    {
        public int totalLoans { get; set; }
        public int pendingLoans { get; set; }
        public int approvedLoans { get; set; }
        public int onLoansCount { get; set; }
        public int overDueLoans { get; set; }
    }
}
