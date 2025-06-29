using BloodDonationSystem.DataAccess.Entities;

namespace BloodDonationSystem.DataAccess.Repositories.BlogPostRepo
{
    public interface IBlogPostRepository
    {
        Task<BlogPost?> GetByIdAsync(int blogId);
        Task<List<BlogPost>> GetAllAsync();
        Task<BlogPost> AddAsync(BlogPost blogPost);
        Task<bool> UpdateAsync(BlogPost blogPost);
        Task<bool> DeleteAsync(int blogId);
    }
}