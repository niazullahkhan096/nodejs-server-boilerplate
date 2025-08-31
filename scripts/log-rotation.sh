#!/bin/bash

# Log rotation script for Node.js server boilerplate
# This script can be run via cron job to manage log files

# Configuration
LOG_DIR="./logs"
MAX_SIZE_MB=10
MAX_FILES=5
DATE_SUFFIX=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting log rotation...${NC}"

# Function to rotate a log file
rotate_log() {
    local log_file="$1"
    local max_size_mb="$2"
    local max_files="$3"
    
    if [ ! -f "$log_file" ]; then
        echo -e "${YELLOW}Log file $log_file does not exist, skipping...${NC}"
        return
    fi
    
    # Get file size in MB
    local file_size_mb=$(du -m "$log_file" | cut -f1)
    
    if [ "$file_size_mb" -gt "$max_size_mb" ]; then
        echo -e "${YELLOW}Rotating $log_file (size: ${file_size_mb}MB)${NC}"
        
        # Create backup with timestamp
        local backup_file="${log_file}.${DATE_SUFFIX}"
        mv "$log_file" "$backup_file"
        
        # Create new empty log file
        touch "$log_file"
        
        # Remove old backup files (keep only max_files)
        local backup_pattern="${log_file}.*"
        local backup_count=$(ls -1 $backup_pattern 2>/dev/null | wc -l)
        
        if [ "$backup_count" -gt "$max_files" ]; then
            local files_to_remove=$((backup_count - max_files))
            echo -e "${YELLOW}Removing $files_to_remove old backup files...${NC}"
            ls -1t $backup_pattern | tail -n $files_to_remove | xargs rm -f
        fi
        
        echo -e "${GREEN}Successfully rotated $log_file${NC}"
    else
        echo -e "${GREEN}$log_file is within size limit (${file_size_mb}MB)${NC}"
    fi
}

# Check if log directory exists
if [ ! -d "$LOG_DIR" ]; then
    echo -e "${RED}Log directory $LOG_DIR does not exist!${NC}"
    exit 1
fi

# Rotate main log files
rotate_log "$LOG_DIR/combined.log" "$MAX_SIZE_MB" "$MAX_FILES"
rotate_log "$LOG_DIR/error.log" "$MAX_SIZE_MB" "$MAX_FILES"
rotate_log "$LOG_DIR/access.log" "$MAX_SIZE_MB" "$MAX_FILES"
rotate_log "$LOG_DIR/application.log" "$MAX_SIZE_MB" "$MAX_FILES"

# Rotate PM2 log files
rotate_log "$LOG_DIR/pm2-combined.log" "$MAX_SIZE_MB" "$MAX_FILES"
rotate_log "$LOG_DIR/pm2-out.log" "$MAX_SIZE_MB" "$MAX_FILES"
rotate_log "$LOG_DIR/pm2-error.log" "$MAX_SIZE_MB" "$MAX_FILES"

echo -e "${GREEN}Log rotation completed!${NC}"

# Optional: Compress old log files older than 7 days
echo -e "${YELLOW}Compressing log files older than 7 days...${NC}"
find "$LOG_DIR" -name "*.log.*" -type f -mtime +7 -exec gzip {} \;

echo -e "${GREEN}Log maintenance completed!${NC}"
