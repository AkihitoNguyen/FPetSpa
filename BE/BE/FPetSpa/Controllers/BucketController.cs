using Amazon.Runtime;
using Amazon.S3;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BucketController : ControllerBase
    {
       // private readonly IAmazonS3 _s3Clients;
        private readonly IConfiguration _configuration;
        AWSCredentials credentials;

        public BucketController(IConfiguration configuration)
        {

         //   _s3Clients = s3clients;
            _configuration = configuration;
            credentials = new BasicAWSCredentials(_configuration.GetValue<string>("AWS:AccessKey")!.Trim(), _configuration.GetValue<string>("AWS:SecretKey")!.Trim());
        }

        [HttpPost]
        public async Task<IActionResult> CreateBucketAysnc(string bucketName)
        {
            var _s3Clients = new AmazonS3Client(credentials, Amazon.RegionEndpoint.APSoutheast2);
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Clients, bucketName);
            if (bucketExists) return BadRequest($"Bucket {bucketName} already exsist.");
            await _s3Clients.PutBucketAsync(bucketName);
            return Created("buckets", $"Bucket {bucketName} created.");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBucketAsync()
        {
            var _s3Clients = new AmazonS3Client(credentials, Amazon.RegionEndpoint.APSoutheast2);
            var data = await _s3Clients.ListBucketsAsync();
            var buckets = data.Buckets.Select(b => { return b.BucketName; });
            return Ok(buckets);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBucketAsync(string bucketName)
        {
            var _s3Clients = new AmazonS3Client(credentials, Amazon.RegionEndpoint.APSoutheast2);
            await _s3Clients.DeleteBucketAsync(bucketName);
            return NoContent();
        }
    }
}
