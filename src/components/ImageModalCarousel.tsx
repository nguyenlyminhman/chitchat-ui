import React from 'react'
import { Modal, Carousel, Image, Button } from 'react-bootstrap'

interface ImageModalCarouselProps {
  show: boolean
  images: string[]
  currentIndex: number
  onHide: () => void
  onSelect: (index: number) => void
  onDownload: (url: string, fileName: string) => void
}

const ImageModalCarousel: React.FC<ImageModalCarouselProps> = ({
  show,
  images,
  currentIndex,
  onHide,
  onSelect,
  onDownload,
}) => (
  <Modal show={show} onHide={onHide} size="lg" centered>
    <Modal.Header closeButton>
      <Modal.Title>
        Image View {images.length > 1 && `(${currentIndex + 1}/${images.length})`}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-center p-0">
      {images.length > 1 ? (
        <Carousel
          activeIndex={currentIndex}
          onSelect={onSelect}
          interval={null}
          indicators={false}
          controls={true}
        >
          {images.map((imageUrl, index) => (
            <Carousel.Item key={index}>
              <Image
                src={imageUrl}
                alt={`Image ${index + 1}`}
                fluid
                className="rounded"
                style={{ maxHeight: '70vh' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <Image
          src={images[0]}
          alt="Full size image"
          fluid
          className="rounded"
          style={{ maxHeight: '70vh' }}
        />
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
      <Button 
        variant="primary" 
        onClick={() => onDownload(images[currentIndex], `image_${currentIndex + 1}.jpg`)}
      >
        Download
      </Button>
    </Modal.Footer>
  </Modal>
)

export default ImageModalCarousel 