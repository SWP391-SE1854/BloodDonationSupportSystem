using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.ReportRepo;

[ApiController]
[Route("api/report")]
public class ReportsController : ControllerBase
{
    private readonly IReportRepository _reportRepository;

    public ReportsController(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    // GET: api/reports
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Report>>> GetReports()
    {
        var reports = await _reportRepository.GetAllAsync();
        return Ok(reports);
    }

    // GET: api/reports/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Report>> GetReport(int id)
    {
        var report = await _reportRepository.GetByIdAsync(id);
        if (report == null)
        {
            return NotFound();
        }
        return Ok(report);
    }

    // POST: api/reports
    [HttpPost]
    public async Task<ActionResult> CreateReport([FromBody] Report report)
    {
        await _reportRepository.AddAsync(report);
        return CreatedAtAction(nameof(GetReport), new { id = report.ReportId }, report);
    }

    // PUT: api/reports/5
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateReport(int id, [FromBody] Report report)
    {
        if (id != report.ReportId)
        {
            return BadRequest("ID mismatch");
        }

        var existing = await _reportRepository.GetByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        await _reportRepository.UpdateAsync(report);
        return NoContent();
    }
}
