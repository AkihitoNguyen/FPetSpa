using Amazon.Runtime;
using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Services
{
    public class ImageService
    {
        private readonly IConfiguration _configuration;
        AWSCredentials credentials;

        public ImageService(IConfiguration configuration)
        {
            _configuration = configuration;
            credentials = new BasicAWSCredentials(_configuration.GetValue<string>("AWS:AccessKey")!.Trim(), _configuration.GetValue<string>("AWS:SecretKey")!.Trim());

        }

        public async Task<string> GetLinkByName(string bucketName, string key)
        {
            var _s3Clients = new AmazonS3Client(credentials, Amazon.RegionEndpoint.APSoutheast2);
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Clients, bucketName);
            if (!bucketExists) return null!;
            var s3Object = await _s3Clients.GetObjectAsync(bucketName, key);
            var result = new GetPreSignedUrlRequest
            {
                BucketName = s3Object.BucketName,
                Key = s3Object.Key,
                Expires = DateTime.UtcNow.AddSeconds(45)
            };
            return _s3Clients.GetPreSignedURL(result);
        }
    }
    public class S3ObjectRequest
    {
        public string? name { get; set; }
        public string? PresignedUrl { get; set; }
    }
}

