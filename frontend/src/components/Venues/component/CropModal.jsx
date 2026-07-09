
import React from 'react'

const CropModal = ({cropState}) => {
  return (
        <>
          {cropState ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/60 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-base-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-300 px-5 py-3">
              <h3 className="flex items-center gap-2 font-bold text-base-content">
                <Icon.image className="h-5 w-5 text-primary" />
                Crop photo
              </h3>
              <button type="button" onClick={() => setCropState(null)} className="btn btn-ghost btn-sm btn-circle">
                <Icon.x className="h-5 w-5" />
              </button>
            </div>

            <div className="relative h-72 w-full bg-base-content/90">
              <Cropper
                image={cropState.current.src}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="px-5 py-4">
              <label className="mb-3 flex items-center gap-3">
                <span className="text-sm font-medium text-base-content/70">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="range range-primary range-xs flex-1"
                />
              </label>
              <div className="flex items-center justify-between gap-3">
                {cropState.queue.length > 0 ? (
                  <span className="text-xs text-base-content/50">{cropState.queue.length} more in queue</span>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={skipCrop} className="btn btn-ghost btn-sm rounded-xl">
                    Cancel
                  </button>
                  <button type="button" onClick={confirmCrop} className="btn btn-primary btn-sm rounded-xl">
                    <Icon.check className="h-4 w-4" />
                    Crop &amp; add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default CropModal