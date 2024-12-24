using LibraryManagerApp.Data.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagerApp.Data.Dto
{
    public class BookShelfViewModal
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public DateTime CreatedOn { get; set; }

        public int BooksCount { get; set; }

        public Guid CabinetId { get; set; }

        public string CabinetName { get; set; }
    }
}
