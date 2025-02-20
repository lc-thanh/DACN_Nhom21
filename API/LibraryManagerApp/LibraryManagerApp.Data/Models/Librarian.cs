﻿namespace LibraryManagerApp.Data.Models
{
    public class Librarian : User
    {
        public IList<Loan> Loans { get; set; }

        public IList<DepositTransaction> DepositTransactions { get; set; }
    }
}
