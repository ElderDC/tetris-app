import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Overlay, ReactPortal } from '@/components/ui/atoms';

interface ModalPops {
  children?: undefined | React.ReactNode | React.ReactNode[];
  overlayColor?: string;
  value?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onContentClick?: () => void;
  onOverlayClick?: () => void;
}

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
  },
};

const Modal = (props: ModalPops) => {
  const {
    children,
    overlayColor,
    value = false,
    onContentClick = () => {},
    onOverlayClick = () => {},
  } = props;

  const handleContentClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onContentClick();
  };
  const handleOverlayClick = (): void => {
    onOverlayClick();
  };

  return (
    <ReactPortal wrapperId="modal-root">
      <AnimatePresence>
        {value ? (
          <>
            <Overlay color={overlayColor} onClick={handleOverlayClick} />
            <div className="modal-container">
              <div className="modal">
                <motion.div
                  variants={dropIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={handleContentClick}
                >
                  {children}
                </motion.div>
              </div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </ReactPortal>
  );
};

export default Modal;
