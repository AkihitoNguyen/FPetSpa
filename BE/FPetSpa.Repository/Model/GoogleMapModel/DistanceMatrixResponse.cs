using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model.GoogleMapModel
{
    public class DistanceMatrixResponse
    {
        public string Status { get; set; }
        public List<string> OriginAddresses { get; set; }
        public List<string> DestinationAddresses { get; set; }
        public List<Row> Rows { get; set; }

        public class Row
        {
            public List<Element> Elements { get; set; }
        }

        public class Element
        {
            public Distance Distance { get; set; }
            public Duration Duration { get; set; }
            public string Status { get; set; }
        }

        public class Distance
        {
            public string Text { get; set; }
            public long Value { get; set; }
        }

        public class Duration
        {
            public string Text { get; set; }
            public long Value { get; set; }
        }
    }

}
