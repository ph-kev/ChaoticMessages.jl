module ChaoticMessages

include("conversion.jl")
include("encryption.jl")
include("error.jl")

export convert_message_to_samples, convert_samples_to_message, binary_to_bmessage

export create_secret_message,
    decrypt_secret_message,
    lorenz_transmitter!,
    lorenz_receiver!,
    lorenz_transmitter_binary!

export error_set_up

end
