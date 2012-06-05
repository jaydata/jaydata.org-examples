using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JayDataExamples.ToDoList.Models
{
    public class Reminder
    {
        public int Id { get; set; }
        public ToDoEntry ToDo { get; set; }
        public DateTime AlarmAt { get; set; }
        public string AlarmTone { get; set; }
    }
}