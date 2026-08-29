# Application logger configuration
"""
Application Logger configuration.
Defines logging settings and formatters used across the BookTicket backend.
"""
import logging
import sys

def setup_logger() -> logging.Logger:
    """
    Initializes and configures the application logger for BookTicket.
    Sets up log levels, formatter, and standard output stream handlers.
    """
    logger = logging.getLogger("bookticket")
    logger.setLevel(logging.INFO)
    
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] in %(module)s: %(message)s"
    )
    
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(formatter)
    
    if not logger.handlers:
        logger.addHandler(stream_handler)
        
    return logger

# Singleton logger instance available across the application modules
logger = setup_logger()
