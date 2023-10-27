using Documenter, ChaoticMessages

makedocs(sitename="ChaoticMessages.jl",
pages = [
    "Home" => "index.md",
    "Examples" => ["Convergence" => "convergence.md", 
                   "Sending a secret message" => "sending_a_message.md",
                   "Sending a secret binary message" => "sending_a_binary_message.md"],
    "Documentation" => "documentation.md"
]
)

# deploydocs(
#     repo = "github.com/ph-kev/ChaoticMessages.jl.git",
# )