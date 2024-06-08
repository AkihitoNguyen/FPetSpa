using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model
{
    public class AwsSetting
    {
        public string AccessKey { get; set; }
        public string SecretKey { get; set; }
        public string BucketName { get; set; }
        public string Region { get; set; }
    }
}
