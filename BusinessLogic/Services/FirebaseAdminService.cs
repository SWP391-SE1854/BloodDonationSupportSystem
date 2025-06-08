using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;

namespace BloodDonationSystem.BusinessLogic.Services
{
    public class FirebaseAdminService
    {

        public FirebaseAdminService()
        {
            
        }

        public async Task<string> GeneratePasswordResetLinkAsync(string email)
        {
            try
            {
                string resetLink = await FirebaseAuth.DefaultInstance.GeneratePasswordResetLinkAsync(email);
                return resetLink;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Không tạo được link reset password", ex);
            }
        }
    }
}
