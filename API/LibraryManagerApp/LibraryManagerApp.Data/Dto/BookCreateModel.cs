﻿using System.ComponentModel.DataAnnotations;

namespace LibraryManagerApp.Data.Dto
{
    public class BookCreateModel
    {
        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        [MaxLength(100)]
        public string? Publisher { get; set; }

        [Range(1, 2099)]
        public int? PublishedYear { get; set; }

        [Required]
        [Range(0, 9999)]
        public int Quantity { get; set; }

        [Required]
        [Range(0, 9999)]
        public int TotalPages {  get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }

        public string? AuthorName { get; set; }

        public Guid? CategoryId { get; set; }

        public Guid? BookShelfId { get; set; }
    }
}
