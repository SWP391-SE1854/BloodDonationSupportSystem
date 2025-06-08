using BloodDonationSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.DataAccess.Repositories.BlogPostRepo
{
    public class BlogPostRepository : IBlogPostRepository
    {
        private readonly AppDbContext _context;

        public BlogPostRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<BlogPost?> GetByIdAsync(int blogId)
        {
            return await _context.Set<BlogPost>().FindAsync(blogId);
        }

        public async Task<List<BlogPost>> GetAllAsync()
        {
            return await _context.Set<BlogPost>().ToListAsync();
        }

        public async Task<BlogPost> AddAsync(BlogPost blogPost)
        {
            _context.Set<BlogPost>().Add(blogPost);
            await _context.SaveChangesAsync();
            return blogPost;
        }

        public async Task<bool> UpdateAsync(BlogPost blogPost)
        {
            var existing = await _context.Set<BlogPost>().FindAsync(blogPost.blog_id);
            if (existing == null)
                return false;

            _context.Entry(existing).CurrentValues.SetValues(blogPost);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int blogId)
        {
            var blogPost = await _context.Set<BlogPost>().FindAsync(blogId);
            if (blogPost == null)
                return false;

            _context.Set<BlogPost>().Remove(blogPost);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}