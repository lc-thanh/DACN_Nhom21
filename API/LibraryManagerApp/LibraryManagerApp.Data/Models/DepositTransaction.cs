﻿using LibraryManagerApp.Data.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagerApp.Data.Models
{
    public class DepositTransaction
    {
        public Guid Id { get; set; }

        [Required]
        public TransactionType TransactionType { get; set; }

        [Required]
        public int Amount { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public User User { get; set; }

        public DateTime Timestamp { get; set; }
    }
}