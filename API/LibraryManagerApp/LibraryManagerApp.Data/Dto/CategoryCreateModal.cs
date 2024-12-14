﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagerApp.Data.Dto
{
    public class CategoryCreateModal
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }
    }
}
