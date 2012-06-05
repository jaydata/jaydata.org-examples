using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace JayDataExamples.ToDoList.Models
{
    public class ToDoListContext : DbContext
    {
        public ToDoListContext() : base("ToDoListContext")
        {
            Database.CreateIfNotExists();
        }
        public DbSet<ToDoEntry> ToDoEntries { get; set; }
        public DbSet<Reminder> Reminders { get; set; }
    }
}