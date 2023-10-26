using DifferentialEquations

"""
    lorenz_transmitter!(du, u, p, t)

Define the parameterized Lorenz system which is used to transmit messages. 

The system of differential equations is -

``\\dot{x_T} = \\sigma (y_T - x_T),``

``\\dot{y_T} = rx_T - y_T - 20 x_T z_T,``

``\\dot{z_T} = 5x_T y_T - b z_T.``

"""
function lorenz_transmitter!(du, u, p, t)
    x_T, y_T, z_T = u
    σ, b, r = p
    du[1] = σ * (y_T - x_T)
    du[2] = r * x_T - y_T - 20 * (x_T * z_T)
    du[3] = 5 * x_T * y_T - b * z_T
end

"""
    lorenz_transmitter_binary!(du, u, p, t)

Define the parameterized Lorenz system which is used to transmit binary messages. 

The system of differential equations is -

``\\dot{x_T} = \\sigma (y_T - x_T),``

``\\dot{y_T} = rx_T - y_T - 20 x_T z_T,``

``\\dot{z_T} = 5x_T y_T - b(t) z_T.``

Notice that the only difference between `lorenz_transmitter!` and 
`lorenz_transmitter_binary!` is that `b` can be a function of time. 
"""
function lorenz_transmitter_binary!(du, u, p, t)
    x_T, y_T, z_T = u
    σ, b, r = p[1], p[2](t), p[3]
    du[1] = σ * (y_T - x_T)
    du[2] = r * x_T - y_T - 20 * (x_T * z_T)
    du[3] = 5 * x_T * y_T - b * z_T
end

"""
    create_secret_message(
        u0::Vector{Float64},
        p::Vector{Float64},
        tspan::Union{Tuple{Float64,Float64},Vector{Float64}},
        message_unencrypted;
        binary::Bool = false,
        scale::Float64 = 1e-5,
        abstol::Float64 = 1e-11,
        reltol::Float64 = 1e-11,
    )

# Arguments
- `u0::Vector{Float64}`: initial condition of the Lorenz system 
- `p::Vector{Float64}`: parameters of the Lorenz system 
- `tspan::Union{Tuple{Float64, Float64}, Vector{Float64}}` : length of the message 
- `message_unencrypted` : function that produces the message that is to be encrpyted
- `binary::Bool = false` : indicates whether the message being encrpyted is binary or not 
- `scale::Float64 = 1e-5` : scaling factor for the secret message 
- `abstol::Float64 = 1e-11` : absolute tolerance for the ODE solver 
- `reltol::Float64 = 1e-11` : relative tolerance for the ODE solver 

Encrpyt the message using a paramterized version of the Lorenz system 
(see `lorenz_transmitter!` and `lorenz_transmitter_binary!`).  
"""
function create_secret_message(
    u0::Vector{Float64},
    p::Vector{Float64},
    tspan::Union{Tuple{Float64,Float64},Vector{Float64}},
    message_unencrypted;
    binary::Bool = false,
    scale::Float64 = 1e-5,
    abstol::Float64 = 1e-11,
    reltol::Float64 = 1e-11,
)
    if !binary
        # Solve chaotic system 
        prob = ODEProblem(lorenz_transmitter!, u0, tspan, p)
        sol_transmitter =
            solve(prob, AutoTsit5(Rodas4P()), abstol = abstol, reltol = reltol)

        # Make a function that return the x-component of the solution 
        function secret_message1(t)
            hidden(t) = scale * message_unencrypted(t)
            secret_at_time_t = sol_transmitter(t, idxs = 1) + hidden(t)
            return secret_at_time_t
        end
        return secret_message1
    else
        (σ, _, r) = p # ignore the second parameter 
        p1 = (σ, message_unencrypted, r) # substitute second paramter for the message 

        # Solve chaotic system 
        prob = ODEProblem(lorenz_transmitter_binary!, u0, tspan, p1)
        sol_transmitter =
            solve(prob, AutoTsit5(Rodas4P()), abstol = abstol, reltol = reltol)

        # Make a function that return the x-component of the solution 
        function secret_message2(t)
            secret_at_time_t = sol_transmitter(t, idxs = 1)
            return secret_at_time_t
        end
        return secret_message2
    end
end

"""
    lorenz_receiver!(secret_message)

Define the parameterized Lorenz system which is used to receive the encrpyted message. 

The system of differential equations is -

``\\dot{x_R} = \\sigma (y_R - x_R),``

``\\dot{y_R} = r \\cdot m(t) - y_R - 20 (m(t) \\cdot z_R),``

``\\dot{z_R} = 5 (m(t) \\cdot y_R) - b \\cdot z_R.``

"""
function lorenz_receiver!(secret_message)
    function parameterized_lorenz_receiver!(du, u_1, p, t)
        x_R, y_R, z_R = u_1
        σ, b, r = p
        du[1] = σ * (y_R - x_R)
        du[2] = r * secret_message(t) - y_R - 20 * (secret_message(t) * z_R)
        du[3] = 5 * (secret_message(t) * y_R) - b * z_R
    end
    return parameterized_lorenz_receiver!
end

"""
    decrypt_secret_message(
        u0::Vector{Float64},
        p::Vector{Float64},
        tspan::Union{Tuple{Float64,Float64},Vector{Float64}},
        secret_message;
        binary::Bool = false,
        scale::Float64 = 1e5,
        abstol::Float64 = 1e-11,
        reltol::Float64 = 1e-11,
    )

# Arguments
- `u0::Vector{Float64}`: initial condition of the variation of the Lorenz system 
- `p::Vector{Float64}`: parameters of the variation of the Lorenz system 
- `tspan::Union{Tuple{Float64, Float64}, Vector{Float64}}` : length of the message 
- `secret_message` : function that produces the secret message that is to be decrypted 
- `binary::Bool = false` : indicates whether the message being decrypted is binary or not 
- `scale::Float64 = 1e-5` : scaling factor for the recovered message 
- `abstol::Float64 = 1e-11` : absolute tolerance for the ODE solver 
- `reltol::Float64 = 1e-11` : relative tolerance for the ODE solver 

Decrypt the message using a paramterized version of the Lorenz system (`lorenz_receiver!`).  
"""
function decrypt_secret_message(
    u0::Vector{Float64},
    p::Vector{Float64},
    tspan::Union{Tuple{Float64,Float64},Vector{Float64}},
    secret_message;
    binary::Bool = false,
    scale::Float64 = 1e5,
    abstol::Float64 = 1e-11,
    reltol::Float64 = 1e-11,
)   
    # Solve chaotic system 
    lorenz_receiver_with_message! = lorenz_receiver!(secret_message)
    prob_R = ODEProblem(lorenz_receiver_with_message!, u0, tspan, p)
    sol_receiver = solve(prob_R, AutoTsit5(Rodas4P()), abstol = abstol, reltol = reltol)

    # Make a function that return the error and scale it if the message is not binary and 
    # square it if the message is binary 
    if !binary
        function decrypted_message1(t)
            return (secret_message(t) - sol_receiver(t, idxs = 1)) * scale
        end
        return decrypted_message1
    else
        function decrypted_message2(t)
            return (secret_message(t) - sol_receiver(t, idxs = 1))^2
        end
        return decrypted_message2
    end
end

