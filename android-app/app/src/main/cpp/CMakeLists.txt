cmake_minimum_required(VERSION 3.22.1)
project(homedesignai)

add_library(homedesignai SHARED
    native-lib.cpp
)

find_library(log-lib log)

target_link_libraries(homedesignai ${log-lib})

