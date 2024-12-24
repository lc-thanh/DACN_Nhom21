using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagerApp.Data.Dto
{
    public class LoansCountByMonthModel
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int TotalLoans { get; set; } // Tổng số phiếu mượn
        public int OverdueLoans { get; set; } // Số phiếu bị Overdue
    }
}
