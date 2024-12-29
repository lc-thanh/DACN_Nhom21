using LibraryManagerApp.Data.Enum;
using LibraryManagerApp.Data.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagerApp.Data.Dto
{
    public class TransactionViewModel
    {
        public Guid Id { get; set; }

        public TransactionType TransactionType { get; set; }

        public int Amount { get; set; }

        public string Description { get; set; }

        public Guid UserId { get; set; }

        public string FullName { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
