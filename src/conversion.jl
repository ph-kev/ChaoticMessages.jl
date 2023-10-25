using WAV
using Interpolations
using Distributions

"""
    convert_message_to_samples(message::String)

Convert a message (.wav file) which is identified as the string of the file path 
and convert it into samples. If `add_noise` is true, then noise is added to the samples. 
The noise is generated from a Gaussian distribution with mean 0 and standard deviation 
`std``.

Return a waveform that is a function of time, number of samples, and the sampling rate. 
"""
function convert_message_to_samples(
    message::String;
    add_noise::Bool = false,
    std::Float64 = 1.0,
)
    # Read wave file 
    sample, sampling_rate = wavread(message)
    sample = vec(sample)
    time_arr = Float64.([(1 / sampling_rate) * n for n = 1:length(sample)])

    # Add noise 
    if add_noise
        noise = rand(Normal(0.0, std), length(sample))
        sample += noise
    end

    # Create linear interpolation of the signals in the waveform 
    message_unencrypted = linear_interpolation(time_arr, sample, extrapolation_bc = Line())

    # Convert interpolation so that it is a function that takes and return Float64 
    function func_message_unencrypted(t)
        val = message_unencrypted(t)
        return val
    end

    # Find number of samples 
    num_samples = length(sample)
    return func_message_unencrypted, num_samples, sampling_rate
end

"""
    convert_samples_to_message(samples, sampling_rate, num_of_samples, name_of_file)

# Arguments
- `samples` : function that produce the samples 
- `sampling_rate` : sampling rate of the resulting file 
- `num_of_samples::Int64` : number of samples of the resulting file 
- `name_of_file::String` : name of the resulting file 

Convert samples into a wav file. 
"""
function convert_samples_to_message(
    samples,
    sampling_rate,
    num_of_samples::Int64,
    name_of_file::String,
)
    time_arr = [(1 / sampling_rate) * n for n = 1:num_of_samples]
    message = samples(time_arr)
    wavwrite(message, name_of_file, Fs = sampling_rate)
end

"""
    binary_to_bmessage(s::String; time_length = 2.0, b_zero = 4.0, b_one = 4.4)

    # Arguments
    - `s::String` : binary string of 0's and 1's  
    - `time_length::Float64 = 2.0` : time between each binary digit 
    - `b_zero::Float64 = 4.0` : value of the function when the binary digit is zero 
    - `b_one::Float64 = 4.4` : value of the function when the binary digit is one 

Return a function that map the time ``t`` to `floor(t/time_length)`th letter 
in the string. The binary digits in the string is counted starting with 0. If ``t < 0`` or 
`t >= time_length * length(binary_arr)`, then it is `b_zero`.
"""
function binary_to_bmessage(
    s::String;
    time_length::Float64 = 2.0,
    b_zero::Float64 = 4.0,
    b_one::Float64 = 4.4,
)
    # Check if the string is binary 
    if !(occursin("0", s) || occursin("1", s))
        error("Only take binary strings of 0's and 1's")
    end

    # Parse string and put them into an array 
    binary_arr = [parse.(Float64, string(c)) for c in s]

    # Iterate through binary_arr and replace them with b_zero if the digit is 0 and b_one
    # otherise 
    for (idx, num) in enumerate(binary_arr)
        if num == 0
            binary_arr[idx] = b_zero
        else
            binary_arr[idx] = b_one
        end
    end

    function binary_func(t::Float64)
        # Check for time values that are not mapped to any digit in the binary string 
        if (t >= time_length * length(binary_arr) || t < 0.0)
            return b_zero
        else
            idx = Int(floor(t / time_length)) + 1 # add one for one-indexing 
            return binary_arr[idx]
        end
    end
    return binary_func
end
