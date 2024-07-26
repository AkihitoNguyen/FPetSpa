using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model
{
    public class ServicePetModel
    {
        public string ServiceID { get; set; }
        public string PictureName { get; set; }
        public string ServiceName { get; set; }
     
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Status { get; set; }
   
        public string PetType { get; set; }


    }
}
