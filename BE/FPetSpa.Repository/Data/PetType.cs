using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Data
{
    public class PetType
    {
        public int Id { get; set; } 
        public string Type {  get; set; }
        public ICollection<Service> Services { get; set; }
    }
}
