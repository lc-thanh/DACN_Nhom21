using LibraryManagerApp.Data.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagerApp.Data.Dto
{
    public class CategoryViewModal
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.Now;

        public int BooksCount { get; set; }
    }
}
