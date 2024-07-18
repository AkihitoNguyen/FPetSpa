using FPetSpa.Models.FeedBackModel;
using FPetSpa.Repository.Data;
using Google;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Repository
{
    public class FeedBackRepository
    {
        private readonly FpetSpaContext _context;

        public FeedBackRepository(FpetSpaContext context)
        {
            _context = context;
        }

        public async Task<List<FeedBack>> GetAllFeedBack()
        {
            return await _context.FeedBack.ToListAsync();
        }

        public async Task<FeedBack> GetFeedBackById(int id)
        {
            return await _context.FeedBack.FindAsync(id);
        }
        public async Task<List<FeedBack>> GetFeedBackByProductId(string id)
        {
            return await _context.FeedBack
            .Where(fb => fb.ProductId == id)
            .ToListAsync();
        }
        public async Task CreateFeedBack(FeedBack feedBack)
        {
            await _context.FeedBack.AddAsync(feedBack);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateFeedBack(FeedBack feedBack)
        {
            _context.FeedBack.Update(feedBack);
            await _context.SaveChangesAsync();
        }

        public void DeleteFeedBack(int id)
        {
            var feedback = _context.FeedBack.Find(id);
            if (feedback != null)
            {
                _context.FeedBack.Remove(feedback);
                _context.SaveChanges();
            }
        }
    }
}
