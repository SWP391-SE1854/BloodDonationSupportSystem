using BloodDonationSystem.DataAccess.Entities;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.DataAccess
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<HealthRecord> Health_Record { get; set; }

        // Thêm các DbSet khác tại đây
        public DbSet<BloodInventory> Blood_Inventory { get; set; }
        public DbSet<BlogPost> Blog_Post { get; set; }
        public DbSet<BloodPost> Blood_Post { get; set; }
        public DbSet<BloodRequest> Blood_Requests { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<HealthRecord>()
                .ToTable("HealthRecords");

            modelBuilder.Entity<User>()
                .HasKey(u => u.user_id);

            modelBuilder.Entity<Donation>()
                .HasOne(d => d.BloodInventory)
                .WithOne(b => b.Donation)
                .HasForeignKey<BloodInventory>(b => b.donation_id);
        }

    }

}
