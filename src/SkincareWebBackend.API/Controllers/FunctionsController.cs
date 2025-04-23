using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.BackendServer.Helpers;
using SkincareWeb.ViewModels.Systems;
using SkincareWebBackend.API.Data;
using SkincareWebBackend.API.Data.Entities;
using Function = SkincareWebBackend.API.Data.Entities.Function;

namespace SkincareWeb.BackendServer.Controllers
{
    public class FunctionsController : BaseController
    {
        private readonly ApplicationDbContext _context;
        public FunctionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // url post: http://localhost:7261/api/functions
        [HttpPost]
        public async Task<IActionResult> PostFunction([FromBody] FunctionCreateRequest request)
        {

            var dbFunction = await _context.Functions.FindAsync(request.Id);
            if (dbFunction != null)
                return BadRequest(new ApiBadRequestResponse($"Function with id {request.Id} is existed."));

            var function = new Function()
            {
                Id = request.Id,
                Name = request.Name,
                ParentId = request.ParentId,
                SortOrder = request.SortOrder,
                Url = request.Url,
                Icon = request.Icon
            };
            _context.Functions.Add(function);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return CreatedAtAction(nameof(GetById), new { id = function.Id }, request);
            }
            else
            {
                return BadRequest(new ApiBadRequestResponse("Create function is failed"));
            }
        }
        //url get: http://localhost:7261/api/functions/
        [HttpGet]
        public async Task<IActionResult> GetFunctions()
        {
            var functions = _context.Functions;
            var functionViewModels = await functions.Select(f => new FunctionViewModel()
            {
                Id = f.Id,
                ParentId = f.ParentId,
                Name = f.Name,
                Url = f.Url,
                Icon = f.Icon,
                SortOrder = f.SortOrder
            }).ToListAsync();
            return Ok(functionViewModels);
        }

        // URL: GET: http://localhost:5001/api/functions?filter={filter}&pageIndex=1&pageSize=10
        [HttpGet("filter")]
        public async Task<IActionResult> GetFunctionsPaging(string filter, int pageIndex, int pageSize)
        {
            var query = _context.Functions.AsQueryable();
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Name.Contains(filter)
                || x.Id.Contains(filter)
                || x.Url.Contains(filter));
            }
            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1 * pageSize))
                .Take(pageSize)
                .Select(u => new FunctionViewModel()
                {
                    Id = u.Id,
                    Name = u.Name,
                    Url = u.Url,
                    SortOrder = u.SortOrder,
                    ParentId = u.ParentId,
                    Icon = u.Icon
                })
                .ToListAsync();

            var pagination = new Pagination<FunctionViewModel>
            {
                Items = items,
                TotalRecords = totalRecords,
            };
            return Ok(pagination);
        }

        [HttpGet("{functionId}/parents")]
        public async Task<IActionResult> GetFunctionsByParentId(string functionId)
        {
            var functions = _context.Functions.Where(x => x.ParentId == functionId);

            var functionvms = await functions.Select(u => new FunctionViewModel()
            {
                Id = u.Id,
                Name = u.Name,
                Url = u.Url,
                SortOrder = u.SortOrder,
                ParentId = u.ParentId,
                Icon = u.Icon
            }).ToListAsync();

            return Ok(functionvms);
        }
        //url get: http://localhost:7261/api/functions/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var function = await _context.Functions.FindAsync(id);
            if (function == null)
                return NotFound(new ApiNotFoundResponse($"Cannot found function with id {id}"));

            var functionVm = new FunctionViewModel()
            {
                Id = function.Id,
                Name = function.Name,
                Url = function.Url,
                SortOrder = function.SortOrder,
                ParentId = function.ParentId,
                Icon = function.Icon
            };
            return Ok(functionVm);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFunction(string id, [FromBody] FunctionCreateRequest request)
        {
            var function = await _context.Functions.FindAsync(id);
            if (function == null)
                return NotFound(new ApiNotFoundResponse($"Cannot found function with id {id}"));

            function.Name = request.Name;
            function.ParentId = request.ParentId;
            function.SortOrder = request.SortOrder;
            function.Url = request.Url;
            function.Icon = request.Icon;

            _context.Functions.Update(function);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return NoContent();
            }
            return BadRequest(new ApiBadRequestResponse("Create function failed"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFunction(string id)
        {
            var function = await _context.Functions.FindAsync(id);
            if (function == null)
                return NotFound(new ApiNotFoundResponse($"Cannot found function with id {id}"));

            _context.Functions.Remove(function);

            var commands = _context.CommandInFunctions.Where(x => x.FunctionId == id);
            _context.CommandInFunctions.RemoveRange(commands);

            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                var functionvm = new FunctionViewModel()
                {
                    Id = function.Id,
                    Name = function.Name,
                    Url = function.Url,
                    SortOrder = function.SortOrder,
                    ParentId = function.ParentId,
                    Icon = function.Icon
                };
                return Ok(functionvm);
            }
            return BadRequest(new ApiBadRequestResponse("Delete function failed"));
        }

        // Command Action in function
        [HttpGet("{functionId}/commands")]
        public async Task<IActionResult> GetCommandsInFunction(string functionId)
        {
            var query = from a in _context.Commands
                        join cif in _context.CommandInFunctions on a.Id equals cif.CommandId into result1
                        from commandInFunction in result1.DefaultIfEmpty()
                        join f in _context.Functions on commandInFunction.FunctionId equals f.Id into result2
                        from function in result2.DefaultIfEmpty()
                        select new
                        {
                            a.Id,
                            a.Name,
                            commandInFunction.FunctionId
                        };

            query = query.Where(x => x.FunctionId == functionId);

            var data = await query.Select(x => new CommandViewModel()
            {
                Id = x.Id,
                Name = x.Name
            }).ToListAsync();

            return Ok(data);
        }
        [HttpPost("{functionId}/commands")]
        public async Task<IActionResult> PostCommandToFunction(string functionId, [FromBody] CommandAssignRequest request)
        {
            foreach (var commandId in request.CommandIds)
            {
                if (await _context.CommandInFunctions.FindAsync(commandId, functionId) != null)
                    return BadRequest(new ApiBadRequestResponse("This command has been existed in function"));

                var entity = new CommandInFunction()
                {
                    CommandId = commandId,
                    FunctionId = functionId
                };

                _context.CommandInFunctions.Add(entity);
            }

            if (request.AddToAllFunctions)
            {
                var otherFunctions = _context.Functions.Where(x => x.Id != functionId);
                foreach (var function in otherFunctions)
                {
                    foreach (var commandId in request.CommandIds)
                    {
                        if (await _context.CommandInFunctions.FindAsync(request.CommandIds, function.Id) == null)
                        {
                            _context.CommandInFunctions.Add(new CommandInFunction()
                            {
                                CommandId = commandId,
                                FunctionId = function.Id
                            });
                        }
                    }
                }
            }
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return CreatedAtAction(nameof(GetById), new { request.CommandIds, functionId });
            }
            else
            {
                return BadRequest(new ApiBadRequestResponse("Add command to function failed"));
            }
        }

        [HttpDelete("{functionId}/commands")]
        public async Task<IActionResult> DeleteCommandToFunction(string functionId, [FromQuery] CommandAssignRequest request)
        {
            foreach (var commandId in request.CommandIds)
            {
                var entity = await _context.CommandInFunctions.FindAsync(commandId, functionId);
                if (entity == null)
                    return BadRequest(new ApiBadRequestResponse("This command is not existed in function"));

                _context.CommandInFunctions.Remove(entity);
            }

            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok();
            }
            else
            {
                return BadRequest(new ApiBadRequestResponse("Delete command to function fai led"));
            }
        }
    }
}
