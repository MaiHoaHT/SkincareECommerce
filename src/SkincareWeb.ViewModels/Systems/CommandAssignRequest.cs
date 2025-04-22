namespace SkincareWeb.ViewModels.Systems
{
    public class CommandAssignRequest
    {
        public string[] CommandIds { get; set; }

        // Add to all command in function or not
        public bool AddToAllFunctions { get; set; }
    }
}
