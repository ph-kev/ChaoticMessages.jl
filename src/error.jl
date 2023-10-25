"""
    error(message_unencrypted::Function, decrypted_message::Function)

Find the error between `message_unencrypted` and `decrypted_message`. 
"""
function error_set_up(message_unencrypted::Function, decrypted_message::Function)
    function abs_error(t)
        val1 = message_unencrypted(t)
        val2 = decrypted_message(t)
        return abs(val1 - val2)
    end
    return abs_error
end
