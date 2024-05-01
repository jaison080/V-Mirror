FROM ubuntu:22.04

# RUN apt-get update && apt-get libgl1

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip

COPY ./requirements.txt /app/requirements.txt
RUN pip3 install -r /app/requirements.txt

RUN apt-get install ffmpeg libsm6 libxext6  -y

COPY streamer.py haarcascade_frontalface_default.xml README.md shirt1.png /app/

COPY ./static /app/static

WORKDIR /app

CMD ["python3", "streamer.py"]