## Documentation

```@contents
Pages = ["documentation.md"]
```

## Functions

### Converting 
```@docs
convert_message_to_samples(
    message::String;
    add_noise::Bool = false,
    std::Float64 = 1.0,
)
```

```@docs
convert_samples_to_message(
    samples,
    sampling_rate,
    num_of_samples::Int64,
    name_of_file::String,
)
```

```@docs
binary_to_bmessage(
    s::String;
    time_length::Float64 = 2.0,
    b_zero::Float64 = 4.0,
    b_one::Float64 = 4.4,
)
```
### Encrypting
```@docs
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
```

```@docs
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
```

### Chaotic Systems 
```@docs
lorenz_transmitter!(du, u, p, t)
```

```@docs
lorenz_receiver!(secret_message)
```

```@docs
lorenz_transmitter_binary!(du, u, p, t)
```
## Index

```@index
```
