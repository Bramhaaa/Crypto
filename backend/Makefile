CXX = g++
CXXFLAGS = -std=c++17 -Wall -I./include
OBJS = hill_cipher.o rsa.o hybrid_main.o utils.o

# Include http_server in the all target
all: hybrid_main http_server

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $<

hybrid_main: $(OBJS)
	$(CXX) $(CXXFLAGS) -o hybrid_main $(OBJS)

# Ensure proper syntax and dependencies for http_server
http_server: http_server.cpp hill_cipher.o rsa.o utils.o
	$(CXX) $(CXXFLAGS) -std=c++17 -o http_server http_server.cpp hill_cipher.o rsa.o utils.o

clean:
	rm -f *.o hybrid_main
