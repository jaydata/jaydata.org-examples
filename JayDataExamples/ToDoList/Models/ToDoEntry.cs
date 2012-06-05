using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JayDataExamples.ToDoList.Models
{
    public class ToDoEntry
    {
        public ToDoEntry()
        {
            Reminders = new List<Reminder>();
        }

        public int Id { get; set; }
        public string Subject { get; set; }
        public string Details { get; set; }
        public string Repeat { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public ICollection<Reminder> Reminders { get; set; }
    }
}