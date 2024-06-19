using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using FPetSpa.Models.S3Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        AWSCredentials credentials;

        public ImageController(IConfiguration configuration)
        {
             _configuration = configuration;
            credentials = new BasicAWSCredentials(_configuration.GetValue<string>("AWS:AccessKey")!.Trim(), _configuration.GetValue<string>("AWS:SecretKey")!.Trim());

        }

        [HttpPost]
        public async Task<IActionResult> UploadFileAsync(IFormFile file, string bucketName, string? prefix)
        {
            var _s3Clients = new AmazonS3Client(credentials, Amazon.RegionEndpoint.APSoutheast2);
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Clients, bucketName);
            if(!bucketExists) return NotFound($"Bucket {bucketName} does not exist.");
            var request = new PutObjectRequest()
            {
                BucketName = bucketName,
                Key = string.IsNullOrEmpty(prefix) ? file.FileName : $"{prefix?.TrimEnd('/')}/{file.FileName}",
                InputStream = file.OpenReadStream()
            };
            request.Metadata.Add("Content-Type", file.ContentType);
            await _s3Clients.PutObjectAsync(request);
            return Ok($"File {prefix}/{file.FileName} uploaded to S3 successfully!!");
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllFilesAsync(string bucketName, string? prefix)
        {
            var _s3Clients = new AmazonS3Client(credentials, Amazon.RegionEndpoint.APSoutheast2);
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Clients, bucketName);
            if (!bucketExists) return NotFound($"Bucket {bucketName} does not exist.");
            var request = new ListObjectsV2Request()
            {
                BucketName = bucketName,
                Prefix = prefix
            };
            var result = await _s3Clients.ListObjectsV2Async(request);
            var s3Objects = result.S3Objects.Select(s =>
            {
                var urlRequest = new GetPreSignedUrlRequest()
                {
                    BucketName = bucketName,
                    Key = s.Key,
                    Expires = DateTime.UtcNow.AddMinutes(1)
                };
                return new S3ObjectRequest()
                {
                     name = s.Key.ToString(),
                    PresignedUrl = _s3Clients.GetPreSignedURL(urlRequest),
                };
            });
            return Ok(s3Objects);
        }

        [HttpGet("get-by-key")]
        public async Task<IActionResult> GetFileByKeyAsync(string bucketName, string key)
        {
            var _s3Clients = new AmazonS3Client(credentials, Amazon.RegionEndpoint.APSoutheast2);
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Clients, bucketName); if (!bucketExists) return NotFound($"Bucket {bucketName} does not exist.");
            var s3Object = await _s3Clients.GetObjectAsync(bucketName, key);
            return File(s3Object.ResponseStream, s3Object.Headers.ContentType);
        }



        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteFileAsync(string bucketName, string key)
        {
            var _s3Clients = new AmazonS3Client(credentials, Amazon.RegionEndpoint.APSoutheast2);
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Clients, bucketName); if (!bucketExists) return NotFound($"Bucket {bucketName} does not exist");
            await _s3Clients.DeleteObjectAsync(bucketName, key);
            return NoContent();
        }

        [HttpGet("get-link-by-name")]
        public async Task<string> GetLinkByName(string bucketName, string key)
        {
            var _s3Clients = new AmazonS3Client(credentials, Amazon.RegionEndpoint.APSoutheast2);
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Clients, bucketName);
            if (!bucketExists) return string.Empty;
            var s3Object = await _s3Clients.GetObjectAsync(bucketName, key);
            var result = new GetPreSignedUrlRequest
            { 
                BucketName = s3Object.BucketName,
                Key = s3Object.Key,
                Expires = DateTime.UtcNow.AddMinutes(1) 
            };
            return  _s3Clients.GetPreSignedURL(result);
        }
    }
}
