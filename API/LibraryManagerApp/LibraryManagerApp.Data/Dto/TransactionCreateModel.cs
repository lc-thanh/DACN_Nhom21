using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagerApp.Data.Dto
{
    public class TransactionCreateModel
    {
        [Required]
        public int Amount { get; set; }

        [Required]
        public string Description { get; set; }
    }
}
