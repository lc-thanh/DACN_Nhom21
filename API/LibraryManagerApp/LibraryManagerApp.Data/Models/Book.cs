﻿using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace LibraryManagerApp.Data.Models
{
    public class Book
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        [MaxLength(100)]
        public string? Publisher { get; set; }

        public int? PublishedYear { get; set; }

        [Required]
        public int Quantity { get; set; } = 0;

        [Required]
        public int AvailableQuantity { get; set; } = 0;
        
        [Required]
        public int TotalPages { get; set; } = 1;

        [MaxLength(512)]
        public string ImageUrl { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.Now;

        public string? AuthorName { get; set; }

        public Guid? CategoryId { get; set; }
        public Category Category { get; set; }

        public Guid? BookShelfId { get; set; }
        public BookShelf BookShelf { get; set; }

        public IList<LoanDetail> LoanDetails { get; set; }
    }
}
