using FPetSpa.Models.FeedBackModel;
using FPetSpa.Repository.Data;
using FPetSpa.Repository.Repository;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twilio.TwiML.Voice;

namespace FPetSpa.Repository.Services
{
    public class FeedBackService : IFeedBackService
    {
        private readonly IUnitOfWork _unitOfWork;

        public FeedBackService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<FeedBack>> GetAllFeedBack()
        {
            try
            {
                return await _unitOfWork.FeedBackRepository.GetAllFeedBack();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error retrieving feedback", ex);
            }
        }
        public async Task<List<FeedBack>> GetFeedBackByProductId(string productId)
        {
            return await _unitOfWork.FeedBackRepository.GetFeedBackByProductId(productId);
        }

        public async Task<FeedBack> GetFeedBackById(int id)
        {
            try
            {
                return await _unitOfWork.FeedBackRepository.GetFeedBackById(id);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error retrieving feedback with id {id}", ex);
            }
        }

        public async Task<FeedBack> CreateFeedBack(RequestFeedBackModel requestFeedBackModel)
        {
            try
            {
                var feedback = new FeedBack
                {
                    UserFeedBackId = requestFeedBackModel.UserFeedBackId,
                    ProductId = requestFeedBackModel.ProductId,
                    PictureName = requestFeedBackModel.PictureName,
                    Star = requestFeedBackModel.Star,
                    Description = requestFeedBackModel.Description
                };
                await _unitOfWork.FeedBackRepository.CreateFeedBack(feedback);
                return feedback;
            }
            catch (Exception ex)
            {

                throw new ApplicationException("Error creating feedback", ex);
            }

        }

        public async Task<FeedBack> UpdateFeedBack(int id, RequestFeedBackModel requestFeedBackModel)
        {
            try
            {
                var existedFeedBack = await _unitOfWork.FeedBackRepository.GetFeedBackById(id);

                if (existedFeedBack != null)
                {
                    existedFeedBack.UserFeedBackId = requestFeedBackModel.UserFeedBackId;
                    existedFeedBack.ProductId = requestFeedBackModel.ProductId;
                    existedFeedBack.PictureName = requestFeedBackModel.PictureName;
                    existedFeedBack.Star = requestFeedBackModel.Star;
                    existedFeedBack.Description = requestFeedBackModel.Description;
                }
                await _unitOfWork.FeedBackRepository.UpdateFeedBack(existedFeedBack);
                return existedFeedBack;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error updating feedback with id {id}", ex);
            }
        }

        public void DeleteFeedBack(int id)
        {
            try
            {
                _unitOfWork.FeedBackRepository.DeleteFeedBack(id);

            }
            catch (Exception ex)
            {

                throw new ApplicationException($"Error deleting feedback with id {id}", ex);
            }
        }
    }
}
